import Tickets from "../models/tickets.js";
import numeral from "numeral";
import Approvals from "../models/approvals.js";
import CustomizationDetails from "../models/customizationDetails.js";
import Inquires from "../models/inquires.js";
import Marketings from "../models/marketing.js";

const GetAdminDashboardStats = async (req, res) => {
  const { admin } = req;

  try {
    const unassigned = numeral(
      await Tickets.countDocuments({ status: "UNASSIGNED" })
    ).format("00");

    const pending = numeral(
      await Tickets.countDocuments({
        status: "ASSIGNED",
        assignedTo: admin._id,
      })
    ).format("00");

    const pendingApprovals = numeral(
      await Approvals.countDocuments({
        status: "PENDING",
      })
    ).format("00");

    const approved = numeral(
      await Approvals.countDocuments({
        status: "APPROVED",
      })
    ).format("00");

    const customization = await CustomizationDetails.distinct("customerId", {
      accepted: true,
    });

    console.log();

    const inquiry = numeral(await Inquires.countDocuments({})).format("00");

    const communications = numeral(await Marketings.countDocuments({})).format(
      "00"
    );

    return res.status(200).json({
      tickets: { pending, unassigned },
      approvals: {
        pending: pendingApprovals,
        approved,
      },
      customizations: {
        pending: numeral(customization.length).format("00"),
      },
      inquiries: { pending: inquiry },
      marketing: { pending: communications },
    });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export { GetAdminDashboardStats };
