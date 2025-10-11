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
    title: "Enterprise FHIR Platform",
    Svg: require("@site/static/img/fhir-architecture.png").default,
    description: (
      <>
        Full FHIR R4 compliance with multi-tenant architecture, with all FHIR
        resources, and multiple validation modes. US Core Implementation Guide
        ready with comprehensive Admin UI and Observability.
      </>
    ),
  },
  {
    title: "Couchbase Excellence",
    Svg: require("@site/static/img/couchbase-architecture.png").default,
    description: (
      <>
        Proven Couchbase excellence. Native JSON storage, powerful FTS indexes,
        KV operations with full ACID compliance, and sub-millisecond performance
        at enterprise scale.
      </>
    ),
  },
  {
    title: "Developer Experience",
    Svg: require("@site/static/img/developer.png").default,
    description: (
      <>
        Easy one line setup, Docker based, with comprehensive documentation,
        REST APIs, and beautiful dashboards. FHIR resource viewer, end-to-end
        observability, and extensible architecture.
      </>
    ),
  },
  {
    title: "Open Source Freedom",
    Svg: require("@site/static/img/open-source.png").default,
    description: (
      <>
        100% open source and free! You own your data with Couchbase self-managed
        or Capella. Extend with Couchbase Enterprise Analytics, AI services, and
        the full Couchbase platform when you're ready to scale.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--3")}>
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
