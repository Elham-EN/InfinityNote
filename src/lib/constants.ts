import { StaticImageData } from "next/image";
import client1 from "../../public/client1.png";
import client2 from "../../public/client2.png";
import client3 from "../../public/client3.png";
import client4 from "../../public/client4.png";
import client5 from "../../public/client5.png";

interface ClientTypes {
  logo: StaticImageData;
  alt: string;
}

export const CLIENTS: ClientTypes[] = [
  { logo: client1, alt: "client1" },
  { logo: client2, alt: "client2" },
  { logo: client3, alt: "client3" },
  { logo: client4, alt: "client4" },
  { logo: client5, alt: "client5" },
];
