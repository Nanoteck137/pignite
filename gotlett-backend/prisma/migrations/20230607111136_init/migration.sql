-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectListItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "ProjectListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- AddForeignKey
ALTER TABLE "ProjectList" ADD CONSTRAINT "ProjectList_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectListItem" ADD CONSTRAINT "ProjectListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ProjectList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
