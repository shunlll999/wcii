import TitleAnimator from "./title-animator";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { slug: 'home-a' },
    { slug: 'home-b' }
  ];
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return {
    title: slug.toLocaleUpperCase(),
  };
}

type SlagProps = {
  params: Params;
};

export default async function Slag({ params }: SlagProps) {
  const { slug } = await params;
  return (
    <div>
      <TitleAnimator slug={slug} />
      <div>Hello world {slug}</div>
    </div>
  );
}
