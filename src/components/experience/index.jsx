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
    date="Apr. 2023 - present"
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
      Member of the platform team in charge of a Kubernetes platform formed by 5 clusters and more than 500 microservices in production<br/>
      Providing a self service platform via infrastructure as code for development teams.<br/>
      - Terraform modules for infrastructure needs.<br/>
      - CI/CD pipeline and release model. Jenkins + ArgoCD<br/>
      - Quality and DevSecOps process in the model<br/>
      - On call support for the platform<br/>
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
      Cloud infrastructure projects, mainly centered in AWS using Terraform and with major focus on Kubernetes enviroments using AWS EKS.<br/>
      Projects of CI/CD focusing on follwing GIT OPS. Mainly focusing on containerized environments using jenkins / helm / ArgoCD.<br/>
      Migrations to AWS cloud and cost optimization of already stablished clients
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
    <h3 className="vertical-timeline-element-title">Junior QA Tester and Web developer (Selenium, Angular, Java + Spring)</h3>
    <h4 className="vertical-timeline-element-subtitle">BuyPower, Mataró</h4>
    <p>
    Back-end development: Java, Spring iHibernate. Front-end development: Angular, HTML, CSS, JS, Bootstrap. End-to-end testing with Selenium. API testing with POSTMAN. Test automation with Jenkins pipelines.
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