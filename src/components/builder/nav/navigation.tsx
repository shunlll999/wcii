'use client';
import { navigationController } from "@Controllers/navigation.controller";
import Link from "@Shared/components/ui/link";
import { menuData } from "@Shared/constants/navigationData";
import { useRouter } from "next/navigation";


export const Navigation = () => {
  const router = useRouter()
  return (
    <ul>
      hierarchy
      {menuData.map((item, index) => (
        <li key={index}>
            <Link
              data-value={item.href}
              onController={{ onClick:(evt) => navigationController.onClick(evt, () => {
                // Handle the click event, e.g., navigate to a different page or perform an action
                router.push(item.href);
              }) }}
            >
            {item.title}
            </Link>
        </li>
      ))}
      {/* <li>Home A</li>
      <li><Link>Home B</Link></li>
      <li>About</li>
      <li>Contact</li>
      <li>Blog</li>
      <li>Portfolio</li>
      <li>Services</li>
      <li>Testimonials</li>
      <li>FAQ</li>
      <li>Privacy Policy</li>
      <li>Terms of Service</li> */}
    </ul>
  )
}
