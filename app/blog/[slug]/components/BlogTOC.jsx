"use client";

export default function BlogTOC({
  tocItems = [],
  activeId,
  scrollToHeading,
}) {
  if (!tocItems.length) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm w-full lg:w-[320px] xl:w-[340px]">

      <h3 className="text-lg font-semibold mb-3">
        Table of Contents
      </h3>

      <ul className="space-y-2 text-sm">
        {tocItems.map((item, index) => {
          const h2Number = index + 1;

          return (
            <li key={item.id}>

              {/* ================= H2 ================= */}
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`
                  w-full text-left px-2 py-2 border-l-2 transition-all duration-200
                  ${
                    activeId === item.id
                      ? "border-[#993F7F] text-[#DBA40D] font-semibold bg-[#FFF8F2]"
                      : "border-transparent text-gray-700 hover:text-[#DBA40D]"
                  }
                `}
              >
                <span className="flex items-start gap-2">
                  <span className="min-w-[28px] text-gray-400">
                    {h2Number}.
                  </span>
                  <span className="flex-1 break-words">
                    {item.label}
                  </span>
                </span>
              </button>

              {/* ================= H3 CHILDREN ================= */}
              {item.children?.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {item.children.map((child, childIndex) => {
                    const h3Number = `${h2Number}.${childIndex + 1}`;

                    return (
                      <li key={child.id}>
                        <button
                          onClick={() => scrollToHeading(child.id)}
                          className={`
                            w-full text-left pl-6 pr-2 py-1.5 border-l-2 transition-all duration-200 text-[13px]
                            ${
                              activeId === child.id
                                ? "border-[#993F7F] text-[#DBA40D] font-medium bg-[#FFF8F2]"
                                : "border-transparent text-gray-500 hover:text-[#DBA40D]"
                            }
                          `}
                        >
                          <span className="flex items-start gap-2">
                            <span className="min-w-[38px] text-gray-400">
                              {h3Number}
                            </span>
                            <span className="flex-1 break-words">
                              {child.label}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

            </li>
          );
        })}
      </ul>

    </div>
  );
}
