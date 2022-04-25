export const editAvatarFileName = (req, file: Express.Multer.File, cb) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = file.originalname.split('.').pop();
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  return cb(null, `${name}-${randomName}.${fileExtName}`);
};

export const avatarFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
