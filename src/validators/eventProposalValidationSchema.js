exports.eventProposalValidationSchema = (isEdit = false) => {
  return {
    name: {
      in: ["body"],
      isEmpty: {
        negated: true,
        errorMessage: "Name is required",
      },
      isString: {
        errorMessage: "Name must be a string",
      },
      trim: true,
      isLength: {
        options: { max: 100 },
        errorMessage: "Name must not exceed 100 characters",
      },
      optional: isEdit,
    },
    description: {
      in: ["body"],
      isEmpty: {
        negated: true,
        errorMessage: "Description is required",
      },
      isString: {
        errorMessage: "Description must be a string",
      },
      trim: true,
      isLength: {
        options: { min: 10, max: 500 },
        errorMessage: "Description must be between 10 and 500 characters",
      },
      optional: isEdit,
    },
    date: {
      in: ["body"],
      isEmpty: {
        negated: true,
        errorMessage: "Date is required",
      },
      isISO8601: {
        errorMessage:
          "Date must be in ISO 8601 format (e.g., YYYY-MM-DDTHH:mm:ssZ)",
      },
      toDate: true,
      optional: isEdit,
    },
    location: {
      in: ["body"],
      isEmpty: {
        negated: true,
        errorMessage: "Location is required",
      },
      isString: {
        errorMessage: "Location must be a string",
      },
      trim: true,
      isLength: {
        options: { max: 200 },
        errorMessage: "Location must not exceed 200 characters",
      },
      optional: isEdit,
    },
    available_seats: {
      in: ["body"],
      isEmpty: {
        negated: true,
        errorMessage: "Available seats is required",
      },
      isInt: {
        options: { min: 30 },
        errorMessage: "Seats must be at least 30",
      },
      optional: isEdit,
    },
  };
};
