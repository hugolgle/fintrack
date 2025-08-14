const GroupTransactionModel = require("../models/groupTransaction.model");

module.exports.getGroups = async (req, res) => {
  try {
    const groups = await GroupTransactionModel.find({
      user: req.userId,
    }).populate("transactions");
    return res.json(groups);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports.createGroup = async (req, res) => {
  try {
    const group = new GroupTransactionModel({ user: req.userId, ...req.body });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.getGroupById = async (req, res) => {
  try {
    const group = await GroupTransactionModel.findById(req.params.id).populate(
      "transactions"
    );
    if (!group) return res.status(404).json({ error: "Groupe non trouvé" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateGroup = async (req, res) => {
  try {
    const updatedGroup = await GroupTransactionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(400).json({ message: "Ce groupe n'existe pas" });
    }

    return res.status(200).json({
      message: "Groupe mis à jour avec succès !",
      updatedGroup,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du groupe",
      error,
    });
  }
};

module.exports.deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await GroupTransactionModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedGroup) {
      return res.status(404).json({ message: "Groupe non trouvé" });
    }
    return res.status(200).json({ message: "Groupe supprimé avec succès" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression du groupe", error });
  }
};

module.exports.addTransactionToGroup = async (req, res) => {
  try {
    const transactionIds = req.body.transactionId || [];
    const group = await GroupTransactionModel.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

    transactionIds.forEach((id) => {
      if (!group.transactions.map((t) => t.toString()).includes(id)) {
        group.transactions.push(id);
      }
    });

    await group.save();
    res.status(200).json({ message: "Transactions mises à jour", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.removeTransactionFromGroup = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: "transactionId manquant" });
    }

    const group = await GroupTransactionModel.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

    const beforeCount = group.transactions.length;

    group.transactions = group.transactions.filter(
      (t) => t.toString() !== transactionId.toString()
    );

    if (group.transactions.length === beforeCount) {
      return res
        .status(404)
        .json({ error: "Transaction non trouvée dans le groupe" });
    }

    await group.save();
    res.status(200).json({ message: "Transaction retirée du groupe", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
