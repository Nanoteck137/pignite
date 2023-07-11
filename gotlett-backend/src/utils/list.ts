import { PrismaClient, ProjectListItem } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Id } from "../model/id";

async function getList(prisma: PrismaClient, listId: Id) {
  return await prisma.projectListItem.findMany({
    where: { listId: listId },
    orderBy: { index: "asc" },
  });
}

async function updateList(
  prisma: PrismaClient,
  updatedItems: any[],
  items: ProjectListItem[],
) {
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    // If the item index dont match then we need to update them
    if (item.index != index) {
      // Push on the new updated item transaction
      updatedItems.push(
        prisma.projectListItem.update({
          where: { id: item.id },
          data: { index },
        }),
      );
    }
  }
}

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

  const items = await getList(prisma, item.listId);

  // Remove the item we are reordering
  const [removedItem] = items.splice(item.index, 1);

  // Insert the item where it should be
  items.splice(beforeItem.index, 0, removedItem);

  // List of prisma transactions with new item index
  const updatedItems: any[] = [];
  updateList(prisma, updatedItems, items);

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
    // Get the full item
    const beforeItem = await prisma.projectListItem.findUnique({
      where: { id: beforeId },
    });

    if (!beforeItem || beforeItem.listId != listId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const sourceListItems = await getList(prisma, item.listId);
    const destListItems = await getList(prisma, listId);

    const sourceIndex = sourceListItems.findIndex((i) => i.id == item.id);
    const destIndex = destListItems.findIndex((i) => i.id == beforeItem.id);

    const [old] = sourceListItems.splice(sourceIndex, 1);
    destListItems.splice(destIndex, 0, old);

    // List of prisma transactions with new item index
    const updatedItems = [];
    updatedItems.push(
      prisma.projectListItem.update({
        where: { id: item.id },
        data: { listId },
      }),
    );

    updateList(prisma, updatedItems, destListItems);
    updateList(prisma, updatedItems, sourceListItems);

    // Wait for all the transactions
    await prisma.$transaction(updatedItems);
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

    const items = await getList(prisma, sourceListId);

    // List of prisma transactions with new item index
    const updatedItems: any[] = [];
    updateList(prisma, updatedItems, items);

    // Wait for all the transactions
    await prisma.$transaction(updatedItems);
  }
}
