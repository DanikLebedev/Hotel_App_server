export const isAdmin = async (req, res, next): Promise<void> => {
    if (!req.user) {
        return res.json({ message: 'something went wrong' });
    }
    const user = req.user;
    console.log(user);
    if (user.status !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
};
