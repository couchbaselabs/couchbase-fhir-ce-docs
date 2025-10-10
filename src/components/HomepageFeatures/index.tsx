import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">> | string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Healthcare Interoperability",
    Svg: require("@site/static/img/interop.png").default,
    description: (
      <>
        Connect disparate healthcare systems seamlessly with full FHIR R4
        compliance, enabling secure data exchange across your healthcare
        ecosystem.
      </>
    ),
  },
  {
    title: "Scalable Architecture",
    Svg: require("@site/static/img/scalable.png").default,
    description: (
      <>
        Built on Couchbase's proven NoSQL platform for enterprise-grade
        performance, handling massive healthcare datasets with sub-millisecond
        response times.
      </>
    ),
  },
  {
    title: "Developer Friendly",
    Svg: require("@site/static/img/developer.png").default,
    description: (
      <>
        Easy setup with comprehensive documentation, REST APIs, and extensible
        architecture. Get your FHIR server running in minutes, not days.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        {typeof Svg === "string" ? (
          <img src={Svg} className={styles.featureSvg} role="img" alt={title} />
        ) : (
          <Svg className={styles.featureSvg} role="img" />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
