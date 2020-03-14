const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require('request-promise');
const RedditArticle = require('./articles');

async function connectToAtlas() {
  try {
    await mongoose.connect(
      'mongodb+srv://reddit:WishMaster@cluster0-s2loh.mongodb.net/reddit?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      }
    );
  } catch (error) {
    console.error(error);
  }

  console.log('Connected to Atlas');
}
async function scrapeReddit() {
  const html = await request.get('https://www.reddit.com/');
  const $ = await cheerio.load(html);
  const titles = $('h3');

  titles.each(async (i, e) => {
    try {
      const title = $(e).text();
      console.log(title);
      // Mongo
      const redditArticle = new RedditArticle({
        title
      });
      await redditArticle.save();
    } catch (error) {
      console.error(error);
    }
  });
}

async function main() {
  await connectToAtlas();
  await scrapeReddit();
}

main();
