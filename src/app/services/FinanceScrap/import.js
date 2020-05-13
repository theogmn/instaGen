import axios from 'axios';
import cheerio from 'cheerio';


export async function getData() {
  const { data } = await axios.get(
    'https://www.infomoney.com.br/ultimas-noticias/'
  );

  if (data) {
    const html = data;

    const $ = cheerio.load(html);

    const list = $('#infiniteScroll');

    const imgTemp = list.find('div').eq(0).find('div').eq(0).find('figure').find('img').attr('src');
    
    const tag = list.find('div').eq(0).find('div').eq(1).find('span').eq(0).text();

    const title = list.find('div').eq(0).find('div').eq(1).find('span').eq(1).find('a').attr('title');

    const newsLink = list.find('div').eq(0).find('div').eq(1).find('span').eq(1).find('a').attr('href');

    

    const img = imgTemp.substring(0, imgTemp.indexOf("?"));

    

    return {img, tag, title, newsLink};
  }
}

export async function getNews(link){
  const { data } = await axios.get(link);
  const html = data;

  const $ = cheerio.load(html);

  const list = $('.container');
 
  let notice = list.find('p').text();
 
  
  
  if(notice.indexOf("Newsletter") > -1){
    notice = notice.substring(0, notice.indexOf("Newsletter"));
  }

  if(notice.length > 2100 ){
    notice = notice.substring(0, 2100) + "... Fonte:" + link;
  }else{
    notice = notice + "... Fonte:" + link;
  }

  return notice.trim();
}
