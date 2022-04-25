const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const axios = require("axios");

module.exports.sendEmail = async (event) => {
    const emailList = await getSubscribers();
    
    const randomQuote = await getQuote();
    const emailHTML = createEmailHTML(randomQuote);

    try {
        await sendgrid.sendMultiple({
            to: emailList,
            from: "xxxx@xxxxx.com",
            subject: `[Daily Words of Wisdom]`,
            text: "Get Inspired Today",
            html: emailHTML
        })
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OK' })
    };
}

const getSubscribers = async () => {
    const subscribers = await axios.get(
        "https://cckjt5kip7.execute-api.us-east-1.amazonaws.com/dev/subscribers"
    );
    
    const emailList = [];
    subscribers.data.map(subscriber => {
        emailList.push(subscriber.email);
    });

    return emailList;
}

const getQuote = async () => {
    const getQuotes = await axios.get(
        "https://cckjt5kip7.execute-api.us-east-1.amazonaws.com/dev/quotes"
    );

    const length = getQuotes.data.quotes.length;
    const randomQuote = getQuotes.data.quotes[Math.floor(Math.random() * length)];

    return randomQuote;
}

const createEmailHTML = (randomQuote) => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
   
    
    <body>
      <div class="container", style="min-height: 40vh;
      padding: 0 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;"> 
       <div class="card" style="margin-left: 20px;margin-right: 20px;">
          <div style="font-size: 14px;">
          <div class='card' style=" background: #f0c5c5;
          border-radius: 5px;
          padding: 1.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;">
      
        <p>${randomQuote.quote}</p>
        <blockquote>by ${randomQuote.author}</blockquote>
      
    </div>
          <br>
          </div>
          
         
          <div class="footer-links" style="display: flex;justify-content: center;align-items: center;">
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">Unsubscribe?</a>
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">About Us</a>
         
          </div>
          </div>
      
            </div>
           
    </body>
    </html>`
};

