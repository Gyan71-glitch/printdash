async function getNews() {
  const res = await fetch("http://localhost:3000/api/scrape", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const data = await getNews();

  const hero = data[0];           // BIG NEWS
  const leftList = data.slice(1, 6); // LEFT SMALL LIST
  const opinions = data.slice(6, 12); // RIGHT SIDE

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">

      {/* HEADER */}
      <h1 className="text-4xl font-serif font-bold text-center mb-8">
        The Indianberg
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {/* LEFT SIDE (LIST) */}
        <div className="space-y-4 border-t pt-4">
          {leftList.map((item: any, i: number) => (
            <div key={i} className="flex gap-3">

              {/* SMALL IMAGE */}
              {item.image && (
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover"
                />
              )}

              {/* TITLE */}
              <a href={item.link} target="_blank">
                <p className="text-sm font-serif font-semibold hover:text-red-600">
                  {item.title}
                </p>
              </a>

            </div>
          ))}
        </div>

        {/* CENTER (MAIN NEWS) */}
        <div className="text-center">

          {/* BIG IMAGE */}
          {hero?.image && (
            <img
              src={hero.image}
              className="w-full h-[300px] object-cover mb-4"
            />
          )}

          {/* BIG TITLE */}
          <a href={hero?.link} target="_blank">
            <h2 className="text-3xl font-serif font-bold leading-tight hover:text-red-600">
              {hero?.title}
            </h2>
          </a>

          <p className="text-gray-500 mt-2 text-sm">
            Breaking story from The Indian Berg newsroom.
          </p>

        </div>

        {/* RIGHT SIDE (OPINIONS) */}
        <div className="border-l pl-6 space-y-5">

          <h2 className="font-serif font-bold text-lg">
            Opinions
          </h2>

          {opinions.map((item: any, i: number) => (
            <div key={i}>

              <p className="text-xs text-gray-400 uppercase">
                Editorial
              </p>

              <a href={item.link} target="_blank">
                <p className="font-serif font-semibold hover:text-red-600">
                  {item.title}
                </p>
              </a>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}