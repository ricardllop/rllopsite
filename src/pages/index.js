import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Experience from "@site/src/components/experience";
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (

    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col')}>
            <div class="descriptiontext">
              <h2>Hello, I am Ricard</h2>
              <h1 >DEVOPS ENGINEER</h1>
              <p class="pmid">
                {`DevOps and Infrastructure as Code specialist with expertise in Terraform, AWS, Kubernetes, and Docker. Proficient in designing and deploying scalable, reliable cloud architectures using Terraform, ArgoCD, and Helm.`}
              </p>
              <p class="pmid">
                {`Skilled in Bash scripting, and CI/CD tools like Jenkins and Git. Adept at integrating code quality tools such as SonarQube & Trivy.`}
              </p>
              <p>
                {`Proven ability to collaborate across teams, driving efficiency and innovation in deployment pipelines. Committed to continuous improvement and staying current with emerging technologies`}
              </p>
            </div>
          </div>
          <div className={clsx('col')}>
            <img src="img/sitelogo.png" alt="Photo of me (Ricard)" className="profileimg" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Ricard Llop">
      <HomepageHeader />
      <main>
        <Experience />
        
      </main>
    </Layout>
  );
}
