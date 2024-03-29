import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getNonSensitive());
});

router.get('/:id', (req, res) => {
    const patient = patientService.getById(req.params.id);
    if (patient !== undefined) {
        res.send(patient);
    } else {
        res.status(404).end();
    }
});

router.post('/', (req, res) => {
    try {
        const newPatient = toNewPatient(req.body);
        const addedPatient = patientService.addPatient(newPatient);
        res.json(addedPatient);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/:id/entries', (req, res) => {
    try {
        const newEntry = toNewEntry(req.body);
        const patient = patientService.getById(req.params.id);
        if (patient !== undefined && newEntry !== undefined) {
            const addedEntry = patientService.addEntry(newEntry, patient);
            res.json(addedEntry);
        } else {
            res.status(404).end();
        }
    } catch (e) {
        res.status(400).send(e.message);
    }
});

export default router;
