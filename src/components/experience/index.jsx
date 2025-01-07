// @flow strict

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


function Experience() {
  return (
    <div id="experience" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <VerticalTimeline lineColor='var(--ifm-color-primary)'>
    <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-dark)' }}
    contentArrowStyle={{ borderRight: '30px solid  var(--ifm-color-primary-lightest)' }}
    date="Nov. 2024 - Present"
    dateClassName = "contrastWithBackground"
    iconStyle={{ background: 'var(--ifm-color-primary)', color: '#fff' }}
    icon={
      <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></svg>
    }
  >
    <h3 className="vertical-timeline-element-title">DevOps / Cloud Engineer</h3>
    <h4 className="vertical-timeline-element-subtitle">Ubisoft Barcelona Mobile</h4>
    <p>
      Member of the Xtech team, responsible for:<br/>
      - Jenkins pipelines automation. Unity mobile game client builds and backend services - docker container builds, among other automations.<br/>
      - Operating an everything as infrastructure as code (Terraform) platform, based in AWS & EKS.<br/>
    </p>
  </VerticalTimelineElement>      
  <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-dark)' }}
    contentArrowStyle={{ borderRight: '30px solid  var(--ifm-color-primary-lightest)' }}
    date="Apr. 2023 - Nov. 2024"
    dateClassName = "contrastWithBackground"
    iconStyle={{ background: 'var(--ifm-color-primary)', color: '#fff' }}
    icon={
      <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></svg>
    }
    shadowSize = {'large'}
  >
    <h3 className="vertical-timeline-element-title">DevOps / Cloud Engineer</h3>
    <h4 className="vertical-timeline-element-subtitle">Allianz Technology</h4>
    <p>
      Member of the platform team in charge of an everything as code platform based in AWS formed by 5 Kubernetes clusters with more than 300 microservices in production.<br/>
      Providing the platform as self service via infrastructure as code for more than 100 development teams, that they could operate independently using Atlantis.<br/>
      I was responsible for:<br/>
      - Development and maintainance of Terraform modules for infrastructure needs.<br/>
      - CI/CD pipeline and build & release model. Jenkins + ArgoCD.<br/>
      - Quality and DevSecOps process in the model.<br/>
      - On call support for the platform.<br/>
    </p>
  </VerticalTimelineElement>
  <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-dark)' }}
    contentArrowStyle={{ borderRight: '30px solid  var(--ifm-color-primary-lightest)' }}
    date="Jan. 2021 - Apr. 2023"
    dateClassName = "contrastWithBackground"
    iconStyle={{ background: 'var(--ifm-color-primary)', color: '#fff' }}
    icon={
      <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></svg>
    }
  >
    <h3 className="vertical-timeline-element-title">DevOps Consultant</h3>
    <h4 className="vertical-timeline-element-subtitle">Deloitte</h4>
    <p>
      Cloud infrastructure projects for different clients, mainly centered in AWS using Terraform and with major focus on Kubernetes enviroments using AWS EKS.<br/>
      Projects of CI/CD follwing GIT OPS. Mainly focusing on containerized environments using  Jenkins / helm / ArgoCD.<br/>
      Migrations to AWS cloud and cost optimization of already stablished clients.
    </p>
  </VerticalTimelineElement>
  <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-dark)' }}
    contentArrowStyle={{ borderRight: '30px solid  var(--ifm-color-primary-lightest)' }}
    date="jul. 2019 - Dic. 2020"
    dateClassName = "contrastWithBackground"
    iconStyle={{ background: 'var(--ifm-color-primary)', color: '#fff' }}
    icon={
      <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></svg>
    }
  >
    <h3 className="vertical-timeline-element-title">Junior Web developer</h3>
    <h4 className="vertical-timeline-element-subtitle">BuyPower, Mataró</h4>
    <p>
    Back-end: Java, Spring, iHibernate.<br/>
    Front-end: Angular, HTML, CSS, JS, Bootstrap.<br/>
    End-to-end testing with Selenium. API testing with POSTMAN. Build and Test automation with Jenkins pipelines.
    </p>
  </VerticalTimelineElement>
  <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-dark)' }}
    contentArrowStyle={{ borderRight: '30px solid  var(--ifm-color-primary-lightest)' }}
    date="2016 - 2020"
    dateClassName = "contrastWithBackground"
    iconStyle={{ background: 'var(--ifm-color-primary-lighter)', color: '#fff' }}
    icon={
      <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path></svg>
    }
  >
    <h3 className="vertical-timeline-element-title">Computer Engineering</h3>
    <h4 className="vertical-timeline-element-subtitle">Tecnocampus</h4>

  </VerticalTimelineElement>
  <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-dark)' }}
    contentArrowStyle={{ borderRight: '30px solid  var(--ifm-color-primary-lightest)' }}
    date="2014 - 2016"
    dateClassName = "contrastWithBackground"
    iconStyle={{ background: 'var(--ifm-color-primary-lighter)', color: '#fff' }}
    icon={
      <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path></svg>
    }
  >
    <h3 className="vertical-timeline-element-title">Bachelor's degree</h3>
    <h4 className="vertical-timeline-element-subtitle">Escola Pia Santa Anna Mataró</h4>
  </VerticalTimelineElement>
  
  <VerticalTimelineElement
    iconStyle={{ background: 'rgb(53 146 86)', color: '#fff' }}
    icon={
      <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M20.492,7.969,10.954.975A5,5,0,0,0,3,5.005V19a4.994,4.994,0,0,0,7.954,4.03l9.538-6.994a5,5,0,0,0,0-8.062Z"/></svg>
    }
  />
</VerticalTimeline>
    </div>
  );
};

export default Experience;