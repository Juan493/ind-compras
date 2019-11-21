/* eslint-disable no-unused-vars */
import { tojs, ReE, ReS } from '../services/util.service';

export const Dashboard = function (req, res) {
	let user = req.user.id;
	return res.json({ success: true, message: 'it worked', data: 'user name is :', user: user });
};