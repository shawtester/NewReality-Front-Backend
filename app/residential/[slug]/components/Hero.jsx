import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full xl:w-[1350px] xl:relative bg-[#F7F9FC] py-12 xl:py-2 overflow-hidden">
      <div className="max-w-[1240px] w-full mx-auto px-4 grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-10 items-center ">

        {/* LEFT TEXT */}
        <div className="xl:col-span-6 order-1 flex flex-col items-center xl:items-start text-center xl:text-left py-6 xl:py-0">
          <h1 className="font-extrabold leading-tight text-[28px] sm:text-[36px] md:text-[42px] xl:text-[52px] text-gray-900">
            Your Property Goals Are Our <br />
            <span className="text-[#F5A200]">Top Priority</span>
          </h1>

          <p className="mt-4 text-[16px] sm:text-[17px] md:text-[18px] text-gray-700 font-extrabold">
            Smart Real Estate Solutions That{" "}
            <span className="text-[#F5A200]">Create Value</span>
          </p>

          <p className="mt-6 max-w-[500px] mx-auto xl:mx-0 text-gray-500 text-[14px] sm:text-[15px] leading-[24px] sm:leading-[26px]">
            At Neev Realty, we offer expert guidance for buying, selling, and
            investing in residential and commercial properties. Our focus is on
            transparency, market insight, and long-term value.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="xl:col-span-5 order-2 flex justify-center xl:justify-end px-1 xl:px-0 pt-4 xl:pt-0">
          <div className="relative w-[300px] sm:w-[360px] md:w-[420px] lg:w-[460px] xl:w-[480px] 2xl:w-[540px] 
                          h-[240px] sm:h-[290px] md:h-[340px] lg:h-[380px] xl:h-[420px] 2xl:h-[480px]">
            <Image
              src="/images/hero1.png"
              alt="Hero"
              fill
              className="object-cover rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
