
import Head from "next/head";
const axios = require("axios");

const Home = ({ randomQuote, error }) => {
  if (error) {
    return <div>An error occured: {error.message}</div>;
  }
  return (
    <div className='container'>
      <Head>
        <title>Welcome</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1 className='title'>Welcome!</h1>
        <h3 className='footer'>
          Subscribe and Receive Inspirational Quotes Daily
        </h3>

        <p>Daily emails will look like this:</p>
        <div className='card'>
          <span>
            <p>{randomQuote.quote}</p>
            <blockquote>by {randomQuote.author}</blockquote>
          </span>
        </div>

        <div className='grid'>
          <form onSubmit={sendMessage}>
            <label htmlFor='from'>Name: </label>
            <input
              id='name'
              name='name'
              type='text'
              autoComplete='from'
              required
            />

            <label htmlFor='subject'>Email: </label>
            <input id='email' name='email' type='text' required />

            <label htmlFor='message'>Message: </label>
            <input id='message' name='message' type='text' required />
            <button className='button' type='submit'>
              Subscribe
            </button>
          </form>
        </div>
      </main>

      <footer>Powered by Awesomness</footer>

      <style jsx>{`
        /* Style inputs */
        input[type="text"],
        select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        /* Style the submit button */
        input[type="submit"] {
          width: 100%;
          background-color: #04aa6d;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Add a background color to the submit button on mouse-over */
        input[type="submit"]:hover {
          background-color: #45a049;
        }
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }
        .button {
          width: 100%;
          background-color: #04aa6d;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

const sendMessage = async (event) => {
  event.preventDefault();
  await axios
    .post(
      "https://cckjt5kip7.execute-api.us-east-1.amazonaws.com/dev/static-mailer",
      {
        name: event.target.name.value,
        email: event.target.email.value,
        message: event.target.message.value,
      }
    )
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
};
Home.getInitialProps = async (ctx) => {
  try {
    const res = await axios.get(
      "https://cckjt5kip7.execute-api.us-east-1.amazonaws.com/dev/quotes"
    );
    const quotes = res.data;

    var listLength = quotes.quotes.length;
    var randomQuote = quotes.quotes[Math.floor(Math.random() * listLength)];
    console.log("RAN:::", quotes);
    return { randomQuote };
  } catch (error) {
    return { error };
  }
};

export default Home;
