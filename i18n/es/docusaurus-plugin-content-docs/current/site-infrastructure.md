---
sidebar_position: 1
---

# Infraestructura detrás de este sitio

## Introducción

No soy principalmente un desarrollador frontend, por lo que este sitio no es el más impresionante. Su propósito es servir como CV personal y un espacio para documentar mis proyectos personales de DevOps. El sitio está creado con [Docusaurus](https://docusaurus.io/), que facilita documentar proyectos usando Markdown.

Lo que quizás es más interesante es el **alojamiento del sitio y la configuración del pipeline CI/CD**, aunque admito que es excesivo para un sitio estático. Fue un proyecto de práctica y una muestra de mis habilidades. Este documento explora esta configuración en detalle.

La configuración incluye un **clúster de Kubernetes siempre gratuito** en [Oracle Cloud](https://www.oracle.com/es/cloud/), **contenedorización** del sitio, **CI/CD con GitHub Actions**, **CD con [ArgoCD](https://argo-cd.readthedocs.io/en/stable/)** y **Helm**, tráfico público a través de la **[Gateway API de Kubernetes](https://gateway-api.sigs.k8s.io/)** y acceso privado de administración mediante **[Tailscale](https://tailscale.com/)**. ¡Sigue leyendo si te interesa!

![Esquema](/img/rllopsite-schema.webp)

## El sitio web

El código del sitio está almacenado en este [repositorio de Github](https://github.com/ricardllop/rllopsite), creado con [Docusaurus](https://docusaurus.io/docs), un generador de sitios estáticos basado en React, ideal para documentación, blogs o proyectos personales.

El resultado del build son archivos estáticos, servidos por un contenedor Nginx con una pequeña [configuración](https://github.com/ricardllop/rllopsite/blob/main/nginx/default.conf) para la compresión, las cabeceras de caché y la página 404.

## El clúster de Kubernetes

El clúster de Kubernetes está alojado en [Oracle Cloud](https://www.oracle.com/es/cloud/) y declarado mediante Terraform. El código está disponible públicamente en este [repositorio de Github](https://github.com/ricardllop/tf-oci-cluster-infra).

El código de Terraform declara todos los recursos de infraestructura necesarios en Oracle Cloud (usando únicamente recursos **siempre gratuitos**). Crea:

- 1 VCN
- 2 subredes (1 pública, 1 privada)
- 1 clúster Kubernetes OKE (Oracle)
- 1 Node pool para el clúster, formado por 2 instancias VM.Standard.A1.Flex con 2 OCPUs y 12 GB cada una, aprovechando el límite de [cómputo siempre gratuito de Oracle Cloud](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm#compute).

También incluye una 2ª parte para desplegar [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) mediante Terraform. ArgoCD junto con el [patrón app of apps](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern) se usa para desplegar el resto de recursos necesarios en el clúster. El mismo código de Terraform crea el secreto que necesita el operador de Tailscale (más detalles abajo).

El [README.md](https://github.com/ricardllop/tf-oci-cluster-infra/blob/main/README.md) tiene información mucho más detallada sobre cómo configurarlo si deseas replicarlo.

## Helm charts & App of Apps

Una vez configurado el clúster y desplegado ArgoCD con Terraform, usando GitOps ([patrón app of apps](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern)) podemos desplegar cualquier otra cosa al clúster.

El [repositorio de Github de app of apps](https://github.com/ricardllop/argocd-app-of-apps) es un Helm chart cuyos valores son la lista de Applications de ArgoCD. Cada Application apunta a uno de los charts almacenados en el [repositorio de Github de Helm charts](https://github.com/ricardllop/oke-helm-charts). Ahora mismo estas son las Applications:

- **cert-manager** y un `ClusterIssuer` de Let's Encrypt, para los certificados TLS.
- **CRDs de la Gateway API**, tomados directamente del repositorio upstream [gateway-api](https://github.com/kubernetes-sigs/gateway-api).
- **[kgateway](https://kgateway.dev/)**, la implementación de la Gateway API (basada en Envoy), junto con el `Gateway` público.
- **Operador de Tailscale**, para el acceso privado al clúster.
- **Este sitio**, un despliegue Nginx con su propia ruta y certificado.

Todas se sincronizan automáticamente, con prune y self-heal, así que los repositorios Git son la única forma de cambiar algo en el clúster. Más apps se pueden añadir simplemente al [values.yaml de app of apps](https://github.com/ricardllop/argocd-app-of-apps/blob/main/values.yaml), y Argo las sincronizará y desplegará automáticamente.

## Tráfico público: Gateway API

El sitio se exponía antes con ingress-nginx. Ahora usa la [Gateway API de Kubernetes](https://gateway-api.sigs.k8s.io/), la sucesora de la API de Ingress, con [kgateway](https://kgateway.dev/) como implementación. Así llega una petición al sitio:

1. Los registros DNS de `ricardllop.com` apuntan a una IP pública reservada en Oracle Cloud.
2. Esa IP pertenece a un Network Load Balancer de Oracle Cloud, creado automáticamente para el Service de tipo `LoadBalancer` que kgateway genera a partir del recurso `Gateway`.
3. El proxy Envoy de kgateway termina TLS y compara la petición con el `HTTPRoute` del sitio.
4. La ruta la envía al Service del despliegue Nginx que sirve los archivos estáticos.

Hay un único `Gateway` compartido para todo el clúster, definido en el chart de kgateway, y solo tiene un listener `http`. Todo lo que pertenece a un hostname vive en el chart de la carga de trabajo que lo usa. El [chart de este sitio](https://github.com/ricardllop/oke-helm-charts/tree/main/rllopsite-chart) contiene:

- Un `ListenerSet` que añade al Gateway compartido un listener `https` por hostname.
- El `Certificate` de cert-manager para esos hostnames.
- El `HTTPRoute` asociado a ese `ListenerSet`.
- Un segundo `HTTPRoute` que redirige http a https.

Así una nueva carga de trabajo trae sus propios hostnames y su certificado sin tocar el Gateway.

Los certificados los emite Let's Encrypt a través de cert-manager usando el reto HTTP-01, que cert-manager resuelve creando un `HTTPRoute` temporal en el listener `http` del Gateway.

## Acceso privado: Tailscale

ArgoCD no tiene ruta pública. Su servidor solo está expuesto dentro de mi red de [Tailscale](https://tailscale.com/) mediante el [operador de Tailscale para Kubernetes](https://tailscale.com/kb/1236/kubernetes-operator), de modo que la interfaz de ArgoCD es accesible desde mis propios dispositivos y desde ningún otro sitio. El operador también ejecuta un `Connector` que anuncia la red de pods como subnet route y que puede usarse como exit node.

## Configuración del CI del sitio

Para lograr una integración continua sencilla y poder generar nuevas versiones del contenedor automáticamente con cada commit, usé [GitHub Actions](https://github.com/features/actions).

La configuración está en el propio repositorio: [.github/workflows/build-deploy-docker.yml](https://github.com/ricardllop/rllopsite/blob/main/.github/workflows/build-deploy-docker.yml).

Este workflow de GitHub Actions hace tanto CI como CD (junto con ArgoCD). Explicaré el CI aquí y el CD en la sección siguiente.

El workflow construye y publica una imagen Docker en Docker Hub cuando se hace push a la rama `main`.

1. Inicia sesión en Docker Hub usando credenciales almacenadas en secretos de Github
2. Instala y configura QEMU, habilitando builds multiplataforma
3. Configura Docker Buildx, herramienta CLI para funciones avanzadas de construcción de imágenes
4. Crea un tag único para la imagen Docker usando la fecha y hora en formato `ga-YYYY.MM.DD-HHMM`
5. Construye la imagen Docker para la plataforma `linux/arm64`. Publica la imagen en Docker Hub con el tag generado en el paso anterior

El sitio en sí se construye en una etapa Node que se ejecuta en la arquitectura del runner de GitHub, sin emulación. Solo la imagen final de Nginx, que únicamente copia los archivos estáticos, es `linux/arm64`.

Con estos pasos, la configuración CI está completada y cualquier commit en la rama main disparará la construcción de un nuevo tag de imagen Docker.

## Configuración del CD del sitio

Para lograr un despliegue continuo sencillo, además de tener ArgoCD en configuración de autosync, hay una parte adicional en el workflow de GitHub Actions que se activa con cada push a `main`. Por tanto, en cada build y push al registro Docker, también se ejecutan las siguientes acciones:

1. Hace checkout del directorio `rllopsite-chart` del [repositorio de Helm charts](https://github.com/ricardllop/oke-helm-charts)
2. Usa yq, procesador YAML de línea de comandos, para actualizar el tag de imagen en `rllopsite-chart/values.yaml` con el nuevo tag
3. Configura Git con un nombre de usuario y email por defecto para el commit
4. Hace commit del archivo `values.yaml` actualizado (con el nuevo tag de imagen) en el repositorio
5. Hace push del commit a la rama `main`

ArgoCD detectará esos cambios en su refresco periódico y sincronizará (ya que el autosync está activado), desplegando el contenedor recién construido en el clúster.

## Conclusiones

Este proyecto demuestra un pipeline DevOps completo y robusto, mostrando habilidades en automatización de infraestructura, contenedorización, CI/CD y GitOps. El uso del clúster Kubernetes gratuito de Oracle Cloud, Terraform para el aprovisionamiento de infraestructura, y ArgoCD para la gestión de despliegues con el patrón app-of-apps proporciona una base sólida para escalar aplicaciones.

El pipeline CI/CD, impulsado por GitHub Actions, automatiza la construcción y el despliegue del sitio, con actualizaciones que se reflejan rápidamente en el entorno en producción gracias a la función de autosync de ArgoCD.

En conclusión, esta configuración puede ser excesiva para un sitio estático, pero sirve como proyecto de práctica perfecto para mostrar mis conocimientos con herramientas y metodologías DevOps modernas. La flexibilidad y escalabilidad de la arquitectura garantizan que el sistema pueda adaptarse fácilmente a mejoras futuras, convirtiéndolo en una base valiosa para futuros proyectos y experimentos.
