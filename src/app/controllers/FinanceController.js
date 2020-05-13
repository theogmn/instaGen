import Jimp from 'jimp';
import * as News from '../services/FinanceScrap/import';

class FinanceController {

  async index(req, res){
    console.log("Buscando notícia...");
    const {img, tag, title, newsLink} = await News.getData();
  
    console.log(title);
  
  
    console.log("Preparando imagem...");
    
    const image = await Jimp.read(img);
    const bt = await Jimp.read('https://i.ibb.co/CJKM7C1/bt.jpg');
    
    
  
    const w = image.getWidth();
    const wM = image.getWidth() / 2;
    const h = image.getHeight();
    const hM = image.getHeight() / 2;
  
    if(h < 600 || w < 600) {
      if(h < w){
        await image.crop(hM - (h / 2) , 0, h , h);
      }else{
        await image.crop(wM - (w / 2) , 0, w , w);
      }
    }else{
      await image.crop(wM - 300, hM - 300, 600, 600);
    }
  
    await image.resize(600, 600);
  
    await bt.rotate(90);
  
    image.composite(bt, 0, 400, {
    mode: Jimp.BLEND_MULTIPLY,
    opacitySource: 1,
    opacityDest: 1
    });
  
    console.log("Aplicando texto...");
  
    const fontText = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  
    const fontMension = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const teste = "teste teste \"teste\"";

    const titleCorrected= title.replace(/"/g, "'");

    await image.print(fontMension, 500, 570, "@instagen", 100);
  
    await image.print(fontText, 50, 430, 
      { 
      text: titleCorrected,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE 
      }, 
      500, 130);
  
    
    const name = new Date().toString();
     
    const path = "./tmp/uploads/"+ name + '.' + image.getExtension();
    
    await image.write(path);
  
    console.log("Pronto!");
  
    console.log("----------------");
    const finalNews =  await News.getNews(newsLink);

    const imageUrl= `http://64.227.104.113:3333/files/${name}.${image.getExtension()}`

    return res.json({ title, newsLink, finalNews, imageUrl});
  
  }

}

export default new FinanceController();