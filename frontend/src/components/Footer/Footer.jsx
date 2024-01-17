import {
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <div className="flex justify-around items-center w-full bg-gray-800 p-4 sm:flex-row flex-col text-white">
      <div className="flex gap-5">
        <p>Contact Us</p>
        <p>Privacy Policies</p>
        <p>Help</p>
      </div>
      <div className="flex gap-4">
        <FacebookOutlined />
        <TwitterOutlined />
        <YoutubeOutlined />
      </div>
      <p>@2024 All Rights Reserved</p>
    </div>
  );
}
