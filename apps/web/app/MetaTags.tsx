import Head from "next/head";

type MetaTagProps = {
  title?: string;
  description?: string;
};

const MetaTag = ({
  title = "Hilo | Socialise in the new way",
  description = "Hilo | Socialise in the new way",
}: MetaTagProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Head>
);

export default MetaTag;
