import { registerUser } from './user.service.js';

export async function register(req, res, next) {
  try {
    const { student_id, password, name, email, class: userClass, grade } = req.body;
    const user = await registerUser({ student_id, password, name, email, class: userClass, grade });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
