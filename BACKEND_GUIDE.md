# Backend Reference Guide

---

## Architecture Pattern

```
Request
  └── Route (routes/*.routes.ts)
        └── Controller (controllers/*.controller.ts)
              └── asyncHandler → auto-catches errors
                    └── Mongoose Model (models/*.model.ts)
                          └── MongoDB
```

Each layer has one job:
- **Routes** — map HTTP method + path to a controller function
- **Controllers** — validate input, call the model, return response
- **Models** — define the data shape and talk to MongoDB

---

## Building a New API Module (Step-by-Step)

### Step 1 — Model

Create `src/models/review.model.ts`:

```typescript
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IReview extends Document {
  propertyId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Guard against model re-registration on hot-reload
const Review: Model<IReview> =
  (mongoose.models.Review as Model<IReview>) ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
```

**Checklist:**
- [ ] Interface extends `Document`
- [ ] `timestamps: true` in schema options
- [ ] `Schema.Types.ObjectId` + `ref` for relationships
- [ ] `required`, `trim`, `min/max` where appropriate
- [ ] Guard with `mongoose.models.ModelName ||`

---

### Step 2 — Controller

Create `src/controllers/review.controller.ts`:

```typescript
import { Request, Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import Review from "../models/review.model";

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
});

export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find().lean();
  res.status(200).json({ success: true, data: reviews });
});

export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid review id" });
    return; // always return after sending an error response
  }

  const review = await Review.findById(id).lean();
  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return;
  }

  res.status(200).json({ success: true, data: review });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid review id" });
    return;
  }

  const review = await Review.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
    runValidators: true,
  }).lean();

  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return;
  }

  res.status(200).json({ success: true, data: review });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid review id" });
    return;
  }

  const review = await Review.findByIdAndDelete(id).lean();
  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return;
  }

  res.status(200).send();
});
```

**Checklist:**
- [ ] Always wrap with `asyncHandler`
- [ ] Validate `ObjectId` before any DB call using `req.params.id`
- [ ] `return` after every error response
- [ ] `.lean()` on all read queries
- [ ] `runValidators: true` on updates
- [ ] `returnDocument: "after"` to get the updated doc back
- [ ] Delete returns `200` with empty body

---

### Step 3 — Routes

Create `src/routes/review.routes.ts`:

```typescript
import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";

const router = Router();

router.post("/", createReview);
router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
```

---

### Step 4 — Register in index.ts

Add to `src/routes/index.ts`:

```typescript
import reviewRoutes from "./review.routes";

router.use("/review", reviewRoutes);
```

Endpoints are now live at `/api/v1/review`.

---

## Relationships (Population)

### Define the reference in the schema

```typescript
// Single reference
propertyType: {
  type: Schema.Types.ObjectId,
  ref: "PropertyType",
  required: true,
}

// Array of references
amenities: [
  { type: Schema.Types.ObjectId, ref: "Amenity" }
]
```

### Populate when querying

```typescript
// Populate one field
await Property.findById(id).populate("propertyType").lean();

// Populate multiple fields
await Property.findById(id)
  .populate("propertyType")
  .populate("amenities")
  .lean();

// Populate nested field (select specific fields only)
await Property.findById(id)
  .populate("propertyType", "name iconUrl")
  .lean();
```

> Note: `.lean()` still works with `.populate()` — always use it on read queries.
