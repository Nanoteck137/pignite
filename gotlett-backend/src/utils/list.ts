import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Id } from "../model/id";

export async function moveItem(prisma: PrismaClient, itemId: Id, beforeId: Id) {
  // Get the full item
  const item = await prisma.projectListItem.findUnique({
    where: { id: itemId },
  });

  // Get the full before item
  const beforeItem = await prisma.projectListItem.findUnique({
    where: { id: beforeId },
  });

  if (!item || !beforeItem) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }

  if (item.listId != beforeItem.listId) {
    throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" });
  }

  // Now get all of the list items
  const items = await prisma.projectListItem.findMany({
    where: { listId: item.listId },
    orderBy: { index: "asc" },
  });

  // Remove the item we are reordering
  const [removedItem] = items.splice(item.index, 1);

  // Insert the item where it should be
  items.splice(beforeItem.index, 0, removedItem);

  // List of prisma transactions with new item index
  const updatedItems = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // If the item index dont match then we need to update them
    if (item.index != i) {
      // Set the new index
      item.index = i;
      // Push on the new updated item transaction
      updatedItems.push(
        prisma.projectListItem.update({
          where: { id: item.id },
          data: { index: item.index },
        }),
      );
    }
  }

  // Wait for all the transactions
  await prisma.$transaction(updatedItems);
}

export async function moveItemToList(
  prisma: PrismaClient,
  itemId: Id,
  listId: Id,
  beforeId?: Id,
) {
  // Get the full item
  const item = await prisma.projectListItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }

  // NOTE(patrik): We could check if beforeId is not null and
  // then execute moveItem if we want
  if (item.listId == listId) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }

  if (beforeId) {
    // We need to reorder the list
    throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" });
  } else {
    // Just add the item to the end of the list
    const count = await prisma.projectListItem.count({
      where: { listId: listId },
    });

    const sourceListId = item.listId;

    await prisma.projectListItem.update({
      where: { id: item.id },
      data: { listId: listId, index: count },
    });

    const items = await prisma.projectListItem.findMany({
      where: { listId: sourceListId },
    });

    // List of prisma transactions with new item index
    const updatedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // If the item index dont match then we need to update them
      if (item.index != i) {
        // Set the new index
        item.index = i;
        // Push on the new updated item transaction
        updatedItems.push(
          prisma.projectListItem.update({
            where: { id: item.id },
            data: { index: item.index },
          }),
        );
      }
    }

    // Wait for all the transactions
    await prisma.$transaction(updatedItems);
  }
}
