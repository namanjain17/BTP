import express from 'express';
import path from 'path';
import { resolveCoords } from '../services/coordResolver';
import { LandRecordExtractor } from '../services/recordExtractor';
import { PDFGenerator } from '../services/pdfGenerator';
import { queryOwnershipHistory } from '../blockchain/queryOwnershipHistory';
import { enrollUser } from '../blockchain/enrollUser';

var router = express.Router();


router.get( "/", async (req, res, next) => {
    //Takes lat and lon as query params

    if(!req.isAuthenticated()) return res.redirect("../login");
    let { lat, lon } = req.query;
    if(!lat || !lon) return res.sendFile(path.join(__dirname,'..','views','landrecord.html'));
    console.log(`Lat=${lat} and lon=${lon}`);
    try{
        let resolvedInfo = await resolveCoords(lat, lon);
        let record = await LandRecordExtractor.extractLandRecordFromBL(resolvedInfo);
        res.json({
            success:true,
            data: {
                khasra: record.khasraNo,
                village: record.village,
                subDistrict: record.subDistrict,
                district: record.district,
                state: record.state
            }
        });
    }
    catch(err){
        next(err);
    }
});


router.get('/enrolluser', (_, res) => {
    enrollUser().then(() => {
        res.send('Blockchain user enrolled');
    });
});


router.get('/generate', (req, res, next) => {
    let { khasra, village, subDistrict, district, state } = req.query;

    if (!khasra || !village || !subDistrict || !district || !state) {
        return res.sendFile(
            path.join(__dirname, '..', 'views', 'landrecord.html'),
        );
    }

    queryOwnershipHistory(
        khasra as string,
        village as string,
        subDistrict as string,
        district as string,
        state as string,
    )
        .then(records => {
            let nKhasra = (khasra as string).replace(/\//g, '_');
            PDFGenerator.generatePDF(
                records,
                path.join(process.cwd(), `${nKhasra}_${village}.pdf`),
            );
            res.send('PDF is generated');
        })
        .catch(err => {
            next(err);
        });
});


export default router;