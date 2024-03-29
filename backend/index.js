const express = require('express');
const cors = require('cors');
const path = require("path");

const connectDB = require('./db');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const app = express();
const port = 3000;

const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const applicationRouter = require('./routers/application');
const uploadRouter = require('./routers/upload');
const downloadRouter = require('./routers/download');
const fileRouter = require('./routers/file');
const visaStatusRouter = require('./routers/visaStatus');

const hrVisaStatusRouter = require('./routers/hrVisaStatus');
const hrDownloadRouter = require('./routers/hrDownload');
const hrApplicationRouter = require('./routers/hrApplication')
const hrFileRouter = require('./routers/hrFile');
const notificationRouter = require('./routers/notification');
const regRouter = require('./routers/registration');


connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/download', downloadRouter);
app.use('/api/files', fileRouter);
app.use('/api/visaStatus', visaStatusRouter);

app.use('/api/hrDownload', hrDownloadRouter);
app.use('/api/hrApplications', hrApplicationRouter);
app.use('/api/hrFiles', hrFileRouter);
app.use('/api/hrVisaStatus', hrVisaStatusRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/registrations', regRouter);


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
