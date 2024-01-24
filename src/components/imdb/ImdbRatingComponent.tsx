import React from "react";

const ExternalImdbComponent = ({ imdbId }: { imdbId: string }) => {
  const [domLoaded, setDomLoaded] = React.useState(false);

  React.useEffect(() => {
    setDomLoaded(true);
    const script = document.getElementById("lawl");
    console.log(script);
    script && window.eval(script.innerHTML);
  }, [setDomLoaded, domLoaded]);

  return (
    <>
      <span
        id="temp"
        data-title={imdbId}
        data-user="ur21937501"
        className="imdbRatingPlugin"
        data-style="p1"
      ></span>
      {domLoaded && (
        <script
          id="lawl"
          dangerouslySetInnerHTML={{
            __html: `(function(d,s,id){var js,stags=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return;}js=d.createElement(s);js.id=id;js.src="http://g-ec2.images-amazon.com/images/G/01/imdb/plugins/rating/js/rating.min.js";stags.parentNode.insertBefore(js,stags);})(document,'script','imdb-rating-api');
    document.getElementById("temp")?.classList.remove("ïmdmRatingStyle");
            `,
          }}
        />
      )}
      / 10
    </>
  );
};
export default ExternalImdbComponent;
