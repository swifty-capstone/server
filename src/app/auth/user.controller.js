import { registerUser, setUsername, getUser } from './user.service.js';

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await registerUser({ email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUsername(req, res, next) {
  try {
    const { userId } = req.params;
    const { username } = req.body;
    const user = await setUsername(Number(userId), username);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserInfo(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await getUser(Number(userId));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
