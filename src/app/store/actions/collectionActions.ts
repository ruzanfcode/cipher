// Thunk: add product with duplicate/capacity guard + toast
import { addToCollection, createSavedCollection, deleteSavedCollection, removeFromCollection, removeProductFromSavedCollection, setProductCollectionAssignments, shareSavedCollection, stopSharingSavedCollection } from "@/app/store/slices/collectionSlice";
import { showToast } from "@/app/store/slices/uiSlice";
import { saveCollection } from "@/app/store/slices/collectionSlice";
import { USERS, USER_PROFILES } from "@/data/mockData";
import type { AppDispatch, RootState } from "@/app/store";
import type { Product, Role, SavedCollection } from "@/app/types";

const MAX_SAVED_COLLECTIONS_PER_USER = 10;

function collectionOwner(role: Role | null) {
  return role === "sbu_admin" ? "Alex Chen" :
    role === "sbu_user" ? "Maria Santos" : "Jordan Lee";
}

function collectionOwnerId(role: Role | null) {
  return role ?? "system_admin";
}

function isCollectionOwnedByUser(collection: SavedCollection, ownerId: string, owner: string) {
  return collection.ownerId ? collection.ownerId === ownerId : collection.owner === owner;
}

function createdDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeCollectionName(name: string) {
  return name.trim().toLowerCase();
}

function userHasCollectionNamed(collections: { name: string }[], name: string) {
  const normalizedName = normalizeCollectionName(name);
  return collections.some(collection => normalizeCollectionName(collection.name) === normalizedName);
}

function parseRecipients(recipients: string[]) {
  const uniqueRecipients = new Map<string, string>();
  recipients.flatMap(recipient => recipient.split(/[\n,]+/)).forEach(recipient => {
    const trimmedRecipient = recipient.trim();
    if (trimmedRecipient) uniqueRecipients.set(trimmedRecipient.toLowerCase(), trimmedRecipient);
  });
  return [...uniqueRecipients.values()];
}

function resolveRecipientOwner(recipient: string) {
  const normalizedRecipient = recipient.trim().toLowerCase();
  const profile = Object.values(USER_PROFILES).find(user => user.email.toLowerCase() === normalizedRecipient || user.name.toLowerCase() === normalizedRecipient);
  if (profile) return profile.name;
  const user = USERS.find(item => item.email.toLowerCase() === normalizedRecipient || item.name.toLowerCase() === normalizedRecipient);
  return user?.name ?? recipient.trim();
}

function resolveRecipientOwnerId(recipient: string) {
  const normalizedRecipient = recipient.trim().toLowerCase();
  const profileEntry = Object.entries(USER_PROFILES).find(([, user]) => user.email.toLowerCase() === normalizedRecipient || user.name.toLowerCase() === normalizedRecipient);
  if (profileEntry) return profileEntry[1].userId;
  const user = USERS.find(item => item.email.toLowerCase() === normalizedRecipient || item.name.toLowerCase() === normalizedRecipient);
  return user ? `user-${user.id}` : normalizedRecipient;
}

export const addToCollectionAction =
  (product: Product) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { tempCollection } = getState().collection;
    if (tempCollection.some(p => p.id === product.id)) return;
    if (tempCollection.length >= 10) {
      dispatch(showToast({ message: "Collection is full - max 10 products", variant: "warning" }));
      return;
    }
    dispatch(addToCollection(product));
    dispatch(showToast({ message: `"${product.name}" added to collection`, variant: "success" }));
  };

export const removeFromCollectionAction =
  (id: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    const product = getState().collection.tempCollection.find(item => item.id === id);
    dispatch(removeFromCollection(id));
    dispatch(showToast({ message: product ? `"${product.name}" removed from collection` : "Product removed from collection", variant: "success" }));
  };

// Thunk: save collection + toast
export const saveCollectionAction =
  (name: string, role: Role | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { tempCollection } = getState().collection;
    const owner = collectionOwner(role);
    const ownerId = collectionOwnerId(role);
    const ownedCollections = getState().collection.savedCollections.filter(collection => isCollectionOwnedByUser(collection, ownerId, owner) && !collection.sharedBy);
    if (ownedCollections.length >= MAX_SAVED_COLLECTIONS_PER_USER) {
      dispatch(showToast({ message: "You can create up to 10 collections", variant: "warning" }));
      return;
    }
    if (userHasCollectionNamed(ownedCollections, name)) {
      dispatch(showToast({ message: "Collection name already exists for this user", variant: "warning" }));
      return;
    }
    dispatch(
      saveCollection({
        id: Date.now(),
        name,
        ownerId,
        owner,
        created: createdDate(),
        productIds: tempCollection.map(p => p.id),
      })
    );
    dispatch(showToast({ message: `Collection "${name}" saved`, variant: "success" }));
  };

export const createSavedCollectionAction =
  (name: string, role: Role | null, productIds: number[] = [], collectionId = Date.now()) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const owner = collectionOwner(role);
    const ownerId = collectionOwnerId(role);
    const ownedCollections = getState().collection.savedCollections.filter(collection => isCollectionOwnedByUser(collection, ownerId, owner) && !collection.sharedBy);
    if (ownedCollections.length >= MAX_SAVED_COLLECTIONS_PER_USER) {
      dispatch(showToast({ message: "You can create up to 10 collections", variant: "warning" }));
      return;
    }
    if (userHasCollectionNamed(ownedCollections, name)) {
      dispatch(showToast({ message: "Collection name already exists for this user", variant: "warning" }));
      return;
    }
    dispatch(createSavedCollection({
      id: collectionId,
      name,
      ownerId,
      owner,
      created: createdDate(),
      productIds,
    }));
    dispatch(showToast({ message: `Collection "${name}" created`, variant: "success" }));
  };

export const assignProductToCollectionsAction =
  (product: Product, collectionIds: number[], role: Role | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const owner = collectionOwner(role);
    const ownerId = collectionOwnerId(role);
    const editableCollectionIds = getState().collection.savedCollections
      .filter(collection => isCollectionOwnedByUser(collection, ownerId, owner) && !collection.sharedBy)
      .map(collection => collection.id);
    const validCollectionIds = collectionIds.filter(id => editableCollectionIds.includes(id));
    dispatch(setProductCollectionAssignments({ productId: product.id, collectionIds: validCollectionIds, owner, ownerId }));
    dispatch(showToast({ message: `"${product.name}" assigned to ${validCollectionIds.length} collection${validCollectionIds.length !== 1 ? "s" : ""}`, variant: "success" }));
  };

export const shareSavedCollectionAction =
  (collection: SavedCollection, recipients: string[], role: Role | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const sender = collectionOwner(role);
    const senderId = collectionOwnerId(role);
    const existingCollections = getState().collection.savedCollections;
    const sharedCollections = parseRecipients(recipients)
      .map(recipient => ({ recipient, owner: resolveRecipientOwner(recipient), ownerId: resolveRecipientOwnerId(recipient) }))
      .filter(({ ownerId, owner }) => ownerId !== senderId && owner !== sender)
      .filter(({ ownerId, owner }) => !existingCollections.some(item => (item.ownerId ? item.ownerId === ownerId : item.owner === owner) && item.sharedFromId === collection.id));

    if (sharedCollections.length === 0) {
      dispatch(showToast({ message: "Enter at least one new user to share with", variant: "warning" }));
      return;
    }

    const now = Date.now();
    dispatch(shareSavedCollection(sharedCollections.map(({ recipient, owner, ownerId }, index) => ({
      id: now + index,
      name: collection.name,
      ownerId,
      owner,
      created: createdDate(),
      productIds: collection.productIds,
      sharedById: senderId,
      sharedBy: sender,
      sharedFromId: collection.id,
      sharedWithId: ownerId,
      sharedWith: recipient,
    }))));
    dispatch(showToast({ message: `Collection "${collection.name}" shared with ${sharedCollections.length} user${sharedCollections.length !== 1 ? "s" : ""}`, variant: "success" }));
  };

export const stopSharingSavedCollectionAction =
  (collection: SavedCollection) => (dispatch: AppDispatch, getState: () => RootState) => {
    const sharedCount = getState().collection.savedCollections.filter(item => item.sharedFromId === collection.id).length;
    dispatch(stopSharingSavedCollection(collection.id));
    dispatch(showToast({
      message: sharedCount > 0
        ? `Stopped sharing "${collection.name}" with ${sharedCount} user${sharedCount !== 1 ? "s" : ""}`
        : `"${collection.name}" is not currently shared`,
      variant: sharedCount > 0 ? "success" : "warning",
    }));
  };

export const removeProductFromSavedCollectionAction =
  (collection: SavedCollection, product: Product) => (dispatch: AppDispatch) => {
    dispatch(removeProductFromSavedCollection({ collectionId: collection.id, productId: product.id }));
    dispatch(showToast({ message: `Removed "${product.name}" from "${collection.name}"`, variant: "success" }));
  };

export const deleteSavedCollectionAction =
  (id: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    const collection = getState().collection.savedCollections.find(item => item.id === id);
    dispatch(deleteSavedCollection(id));
    dispatch(showToast({
      message: collection?.sharedBy
        ? `Left shared collection "${collection.name}"`
        : collection ? `Collection "${collection.name}" deleted` : "Collection deleted",
      variant: "success",
    }));
  };
