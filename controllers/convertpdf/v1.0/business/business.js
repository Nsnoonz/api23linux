import { body } from 'express-validator'

import dbhelper from '../../../../helpers/database.helper.js'
import errorhelper from '../../../../helpers/error.helper.js'
import validatorresult from '../../../../middlewares/validatorResult.js'
import database from '../database/database.js'
import puppeteer from 'puppeteer'
import fs from 'fs'
import ftp from 'basic-ftp'
import pdf from 'html-pdf'
import axios from 'axios'
import iconv from 'iconv-lite' 
import path from 'path'

const bfnMakeDirectories = async (listFolder) => {
  if (!fs.existsSync(listFolder.slice(0, listFolder.length - 1).join('/'))) {
    const dirPath = listFolder.slice(0, listFolder.length - 1)
    await bfnMakeDirectories(dirPath)
    await fs.mkdirSync(listFolder.join('/'))
  } else {
    await fs.mkdirSync(listFolder.join('/'))
  }
}

const bfnUploadToFtp = async (fileName, path, ftpPathOnline, params) => {
  const jsreturn = { status: true, msg: '' }
  const client = new ftp.Client()
  client.ftp.verbose = true
  const realPath = process.env.NODE_ENV === 'production' ? ftpPathOnline : `file/test/${params.system}/${params.foldername}`
  const ftppath = realPath
  try {
    await client.access({
      host: 'internal.silkspan.com',
      user: 'ftpuser',
      password: 'ftp759153',
      secure: false
    })
    await client.ensureDir(ftppath)
    await client.uploadFrom(path, `/${ftppath}/${fileName}`)
  } catch (err) {
    jsreturn.status = false
    jsreturn.msg = err.message
  }
  client.close()
  return jsreturn
}

const bfnDateNow = async () => {
  const currentDateTime = new Date()
  const year = currentDateTime.getFullYear() + ''
  const month = '0' + (currentDateTime.getMonth() + 1)
  const day = '0' + currentDateTime.getDate()
  const js = {
    year,
    month: month.substr(month.length - 2),
    day: day.substr(day.length - 2)
  }
  return js
}

const bfnGetFilename = async (params) => {
  const currentDateTime = await bfnDateNow()
  const filename = `${currentDateTime.year}${currentDateTime.month}${currentDateTime.day}`

  return filename
}

const bfnGeneratePDFByHTML = async (params) => {
  const pathfile = path.resolve(`../file/generatepdf/${params.system}/${params.foldername}`);
  fs.mkdirSync(pathfile, { recursive: true });
  const options = params.options || { format: 'Letter' };
  options.timeout = '300000';

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Ensure it works on EC2
  });
  const page = await browser.newPage();

  const htmlContent = params.html;
  console.log('Setting page content...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(pathfile, `${params.filename}.pdf`);
  console.log(`Generating PDF at: ${pdfPath}`);
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();
  console.log('PDF generated successfully.');
  return pathfile
  // try {
  //   fs.statSync(pathfile)
  // } catch (e) {
  //   const listFolder = pathfile.split('/')
  //   await bfnMakeDirectories(listFolder)
  // }
  // return new Promise((resolve, reject) => {
  //   pdf.create(params.html, options).toFile(`${pathfile}/${params.filename}.pdf`, async function (errPdf, res) {
  //     if (errPdf) {
  //       console.log(errPdf)
  //       console.error('Error details:', {
  //         errno: errPdf.errno,
  //         code: errPdf.code,
  //         syscall: errPdf.syscall,
  //         message: errPdf.message,
  //       });
  //       return reject(errPdf);
  //     } else {
  //       // await bfnUploadToFtp(`${params.filename}.pdf`, `${pathfile}/${params.filename}.pdf`, params.ftppath, params)
  //       // const realPath = process.env.NODE_ENV === 'production' ? params.ftppath : `file/test/${params.system}/${params.foldername}`
  //       // resolve({ urlonline: `https://internal.silkspan.com/${realPath}/${params.filename}.pdf`, urllocal: `${pathfile}/${params.filename}.pdf` })
  //       resolve({ urllocal: `${pathfile}/${params.filename}.pdf` })
  //     }
  //   })
  // })
}

const Business = {
  async bfnDemo (req, res) {
    try {
      const params = dbhelper.createParameter(this, req)
      params.username = req.body.username

      const result = await database.dfnDemo(params)
      return result
    } catch (err) {
      throw errorhelper.createError(err)
    }
  },
  async bfnConvertPDF (req, res) {
    try {
      const params = dbhelper.createParameter(this, req)
      params.html = req.body.strhtml
      params.ftppath = req.body.ftppath
      params.filename = req.body.filename
      params.system = req.body.system
      params.options = req.body.options
      params.urlhtml = req.body.urlhtml
      params.typehtml = req.body.typehtml
      let url = params.urlhtml
      // const ttxthtml = await axios.get(url, { responseType: 'arraybuffer' })
      // .then(response => {
      //     const decodedContent = iconv.decode(response.data,  params.typehtml).replace(/src='/g, "src='https://internal.silkspan.com")
      //     return decodedContent
      // })
      // .catch(error => {
      //     console.error('Error fetching page:', error);
      // });
      // params.html = ttxthtml
      console.log(params.html)
      params.foldername = await bfnGetFilename()
      params.urlpdf = await bfnGeneratePDFByHTML(params)
      const result = params.urlpdf
      return result
    } catch (err) {
      throw errorhelper.createError(err)
    }
  }
}

export default Business
