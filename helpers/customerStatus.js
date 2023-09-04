import Approvals from "../models/approvals.js";
import Customers from "../models/customers.js";
import CustomerStatus from "../models/customerStatus.js";

const UpdateCustomerStatus = async (customerId, status) => {
  await Customers.findByIdAndUpdate(customerId, {
    $set: { status },
  });

  await CustomerStatus.findOneAndUpdate(
    { customerId },
    {
      $set: { status },
    }
  );
};

const UpdatePersonalInfoFillStatus = async (customerId, personalInfoFilled) => {
  await CustomerStatus.findOneAndUpdate(
    { customerId },
    { $set: { personalInfoFilled } }
  );
};

const UpdateBankingInfoFillStatus = async (customerId, bankingInfoFilled) => {
  await CustomerStatus.findOneAndUpdate(
    { customerId },
    { $set: { bankingInfoFilled } }
  );
};

const UpdatePropertyInfoFillStatus = async (projectInfoFilled, customer) => {
  const customerStatus = await CustomerStatus.findOne({
    customerId: customer._id,
  });

  if (!(customerStatus.personalInfoFilled && projectInfoFilled)) return;

  await customerStatus.update({
    $set: { projectInfoFilled, status: "UNDER_REVIEW" },
  });

  await Customers.findByIdAndUpdate(customer._id, {
    $set: { status: "UNDER_REVIEW" },
  });

  await Approvals.create({
    customerId: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    type: "MID",
  });
};

export {
  UpdateCustomerStatus,
  UpdatePersonalInfoFillStatus,
  UpdateBankingInfoFillStatus,
  UpdatePropertyInfoFillStatus,
};
