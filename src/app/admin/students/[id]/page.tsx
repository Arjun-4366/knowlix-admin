import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [];
}

export default function Page(props: { params: Promise<{ id: string }> }) {
  return <ClientPage params={props.params} />;
}
