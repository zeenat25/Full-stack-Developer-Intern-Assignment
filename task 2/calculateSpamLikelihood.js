const calculateSpamLikelihood = async (phoneNumber) => {
    const spam = await Spam.findOne({ phoneNumber });
    if (!spam) {
      return 0;
    } else {
      const totalRegisteredUsers = await User.countDocuments();
      return (spam.spamMarks / totalRegisteredUsers) * 100;
    }
  };
  
  export default calculateSpamLikelihood;