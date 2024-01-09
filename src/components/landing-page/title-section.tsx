import React from "react";

interface TitleSectionProps {
  title: string;
  subheading?: string;
  pill: string;
}

function TitleSection({
  title,
  subheading,
  pill,
}: TitleSectionProps): React.ReactElement {
  return (
    <>
      <section className="flex flex-col gap-4 justify-center items-start md:items-center">
        <article
          className="rounded-full p-[1px]  dark:bg-gradient-to-r text-sm sm:text-xl
            dark:from-brand-primaryBlue dark:to-brand-primaryPurple"
        >
          <div className="rounded-full px-4 py-2 dark:bg-black">{pill}</div>
        </article>
        {subheading ? (
          <>
            <h2
              className="text-left text-3xl sm:text-5xl sm:max-w-[750px] md:text-center
                // font-semibold text-brand-washedPurple"
            >
              {title}
            </h2>
            <p className="dark:text-washed-purple-700 sm:max-w-[450px] md:text-center">
              {subheading}
            </p>
          </>
        ) : (
          <h1
            className="text-left text-4xl sm:text-6xl md:text-center font-semibold 
            text-brand-washedPurple"
          >
            {title}
          </h1>
        )}
      </section>
    </>
  );
}

export default TitleSection;
