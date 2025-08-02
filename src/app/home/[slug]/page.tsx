import TitleAnimator from "./title-animator";

export const dynamicParams = true;
export async function generateStaticParams() {
  return [
    { slug: 'home-a' },
    { slug: 'home-b' }
  ];
}

export async function generateMetadata(props: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(props.params); // ✅ Force await
  return {
    title: slug.toLocaleUpperCase(),
  };
}

type Props = {
  params: {
    slug: string; // ✅ แก้ให้ตรงกับ generateStaticParams
  };
};


export default async function Slag({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  return (
    <div>
       <TitleAnimator slug={`${slug}`} />
      <div>Hello world {slug}</div>
    </div>
  );
}
