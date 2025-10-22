import { registerUser, loginUser, refreshAccessToken } from './user.service.js';

export async function register(req, res, next) {
  try {
    const { student_id, password, name, email, class: userClass, grade } = req.body;
    const user = await registerUser({ student_id, password, name, email, class: userClass, grade });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { student_id, password } = req.body;
    const result = await loginUser({ student_id, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
