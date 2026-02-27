import Image from "next/image";

export default function Card({ title, text, icon }) {
  return (
    <article className="bg-white border shadow-md rounded-xl p-6 flex flex-col min-h-[320px]">
      <div className="flex flex-col items-center text-center flex-grow">
        <div className="w-[72px] h-[72px] rounded-xl bg-pink-100 flex items-center justify-center mb-4">
          <Image src={icon} alt={title} width={48} height={48} />
        </div>

        <h4 className="text-[18px] sm:text-[20px] font-semibold text-gray-900">
          {title}
        </h4>

        <p className="text-gray-600 text-[14px] sm:text-[15px] mt-2 leading-relaxed max-w-[240px]">
          {text}
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <span className="text-pink-500 font-medium text-[14px] cursor-pointer">
          Read More →
        </span>
      </div>
    </article>
  );
}
