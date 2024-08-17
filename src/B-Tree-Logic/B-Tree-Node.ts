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

    constructor() {
        this.root = new BTreeNode<T>(true);
    };

    public insert(key: T) {

        if (this.root.keys.length === 2 * this.degree - 1) {
            const newRoot = new BTreeNode<T>(false);
            newRoot.children.push(this.root);
            this.splittingNode(newRoot, 0, this.root);
            this.root = newRoot;

            this.inserKey(newRoot, key);
        } else {
            this.inserKey(this.root, key);
        }
    };
    public returnRoot() {
        return this.root;
    }
    private inserKey(node: BTreeNode<T>, key: T) {
        let i = node.keys.length - 1;
        while (i >= 0 && node.keys[i] > key) i--;
        if (node.isLeaf) {
            node.keys.splice(i + 1, 0, key);
        } else {
            i++
            if (node.children[i].keys.length === 2 * this.degree - 1) {
                this.splittingNode(node, i, node.children[i]);
                if (key > node.keys[i]) {
                    i++;
                };
            };
            this.inserKey(node.children[i], key);
        }
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
