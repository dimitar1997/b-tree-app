export class BTreeNode<T> {
    keys: T[];
    children: BTreeNode<T>[];
    isLeaf: boolean;
    constructor(isLeaf: boolean) {
        this.keys = [];
        this.children = [];
        this.isLeaf = isLeaf;
    };
};

export class BTree<T> {
    private root: BTreeNode<T>;
    private degree = 2;
    private parentNodeForDeletionUse: BTreeNode<T>;

    constructor() {
        this.root = new BTreeNode<T>(true);
        this.parentNodeForDeletionUse = new BTreeNode<T>(false);
    };

    public insert(key: T) {

        this.inserKey(this.root, key);
        if (this.root.keys.length === this.degree + 1) {
            const newRoot = new BTreeNode<T>(false);
            newRoot.children.push(this.root);
            this.splittingNode(newRoot, 0, this.root);
            this.root = newRoot;
        };

    };

    private inserKey(node: BTreeNode<T>, key: T) {

        let i = node.keys.length - 1;
        while (i >= 0 && node.keys[i] > key) i--;
        if (node.isLeaf) {
            node.keys.splice(i + 1, 0, key);
        } else {
            i++

            this.inserKey(node.children[i], key);
            if (node.children[i].keys.length === this.degree + 1) {
                this.splittingNode(node, i, node.children[i]);
                if (key > node.keys[i]) {
                    i++;
                };
            };


        }
    };
    public returnRoot() {
        return this.root;
    };
    public delete(key: T) {
        const node = this.search(key);
        if (node && node.isLeaf) this.deleteKeyFromLeaf(node, key);
    };
    private deleteKeyFromLeaf(node: BTreeNode<T>, key: T) {
        const keyIndex = node.keys.findIndex(v => v === key);

        if (keyIndex === -1) return;


        if (node.keys.length > 1) {
            node.keys.splice(keyIndex, 1);
            return;
        }

        let i = this.parentNodeForDeletionUse.keys.length;
        while (i > 0 && this.parentNodeForDeletionUse.keys[i] > key) i--;
        const childIndex = this.parentNodeForDeletionUse.children.findIndex(n => n === node);
        const leftSiblingNode = this.parentNodeForDeletionUse.children[childIndex - 1];
        // const leftSiblingNode = this.parentNodeForDeletionUse.children[childIndex - 1] ? this.parentNodeForDeletionUse.children[childIndex - 1] : null;

        const rightSiblingNode = this.parentNodeForDeletionUse.children[childIndex + 1];
        if (leftSiblingNode) {
            if (leftSiblingNode.keys.length > 1 && this.parentNodeForDeletionUse.keys.length > 1) {
                const b = this.parentNodeForDeletionUse.keys[0] > leftSiblingNode.keys[i - 1] ? 0 : 1;

                node.keys.splice(keyIndex, 1, this.parentNodeForDeletionUse.keys[b]);
                this.parentNodeForDeletionUse.keys.splice(b, 1, leftSiblingNode.keys[i - 1])
                leftSiblingNode.keys.length--;

            } else if (this.parentNodeForDeletionUse.keys.length > 1 && leftSiblingNode.keys.length === 1) {
                const b = this.parentNodeForDeletionUse.keys[1] > key ? 0 : 1;
                leftSiblingNode.keys.push(this.parentNodeForDeletionUse.keys[b])
                this.parentNodeForDeletionUse.children.splice(childIndex, 1);
                this.parentNodeForDeletionUse.keys.splice(b, 1);
                // this.parentNodeForDeletionUse.keys.length--;
            } else if (this.parentNodeForDeletionUse.keys.length === 1 && leftSiblingNode.keys.length > 1) {
                this.parentNodeForDeletionUse.children[i].keys.splice(0, 1, this.parentNodeForDeletionUse.keys[0]);
                this.parentNodeForDeletionUse.keys.splice(0, 1, leftSiblingNode.keys[i])
                leftSiblingNode.keys.length--;
            } else if (this.parentNodeForDeletionUse.keys.length === 1 && leftSiblingNode.keys.length === 1) {
                leftSiblingNode.keys.push(this.parentNodeForDeletionUse.keys[0]);
                this.handleDeleteRootWithSingleKeyAndSingleLeafsKey(this.parentNodeForDeletionUse, leftSiblingNode);
            }
        } else if (rightSiblingNode) {
            if (this.parentNodeForDeletionUse.keys.length === 1 && rightSiblingNode.keys.length === 1) {
                rightSiblingNode.keys.splice(0, 0, this.parentNodeForDeletionUse.keys[0]);

                this.handleDeleteRootWithSingleKeyAndSingleLeafsKey(this.parentNodeForDeletionUse, rightSiblingNode);
            };

        };

    };
    private handleDeleteRootWithSingleKeyAndSingleLeafsKey(parentNodeForDeletionUse: BTreeNode<T>, siblingNode: BTreeNode<T>) {
        this.parentNodeForDeletionUse.keys = [];
        this.parentNodeForDeletionUse.children = [];
        if (this.root === this.parentNodeForDeletionUse) {
            this.root = siblingNode;
        };
    }
    public search(key: T): BTreeNode<T> | null {
        return this.searchInNode(this.root, key);
    };
    private searchInNode(node: BTreeNode<T>, key: T): BTreeNode<T> | null {
        let i = 0;
        while (i < node.keys.length && node.keys[i] < key) i++;
        if (node.keys[i] === key) return node;

        if (node.isLeaf) return null;
        this.parentNodeForDeletionUse = node;
        return this.searchInNode(node.children[i], key);
    };



    private splittingNode(newParent: BTreeNode<T>, index: number, oldRoot: BTreeNode<T>) {
        const newChildNode = new BTreeNode<T>(oldRoot.isLeaf);
        newParent.children.splice(index + 1, 0, newChildNode);
        newParent.keys.splice(index, 0, oldRoot.keys[this.degree - 1]);

        newChildNode.keys = oldRoot.keys.splice(this.degree);
        oldRoot.keys.length--;

        if (!oldRoot.isLeaf) {
            newChildNode.children = oldRoot.children.splice(this.degree);
        };
    };
}