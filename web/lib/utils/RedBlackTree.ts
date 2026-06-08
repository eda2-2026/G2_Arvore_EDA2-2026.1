import { ReportResponse } from "../api";

export class TreeNode {
    key: number;
    data: ReportResponse;
    left: TreeNode | null = null;
    right: TreeNode | null = null;
    parent: TreeNode | null = null;
    color: 'RED' | 'BLACK' = 'RED';

    constructor(key: number, data: ReportResponse) {
        this.key = key;
        this.data = data;
    } 
}

export class RedBlackTree {
    root: TreeNode | null = null;

    private rotateLeft(node: TreeNode) {
        const rightChild = node.right;

        if (rightChild === null) {
            return;
        }

        node.right = rightChild.left;

        if (rightChild.left !== null) {
            rightChild.left.parent = node;
        }

        rightChild.parent = node.parent;

        if (node.parent === null) {
            this.root = rightChild;
        } else if (node === node.parent.left) {
            node.parent.left = rightChild;
        } else {
            node.parent.right = rightChild;
        }

        rightChild.left = node;
        node.parent = rightChild;
    }

    private rotateRight(node: TreeNode) {
        const leftChild = node.left;

        if (leftChild === null) {
            return;
        }

        node.left = leftChild.right;

        if (leftChild.right !== null) {
            leftChild.right.parent = node;
        }

        leftChild.parent = node.parent;

        if (node.parent === null) {
            this.root = leftChild;
        } else if (node === node.parent.right) {
            node.parent.right = leftChild;
        } else {
            node.parent.left = leftChild;
        }

        leftChild.right = node;
        node.parent = leftChild;
    }

        private fixInsert(node: TreeNode) {
        while (node.parent !== null && node.parent.color === 'RED') {
            const parent = node.parent;
            const grandparent = parent.parent;

            if (grandparent === null) {
                break;
            }

            if (parent === grandparent.left) {
                const uncle = grandparent.right;

                if (uncle !== null && uncle.color === 'RED') {
                    parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    node = grandparent;
                } else {
                    if (node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }

                    node.parent!.color = 'BLACK';
                    grandparent.color = 'RED';
                    this.rotateRight(grandparent);
                }
            } else {
                const uncle = grandparent.left;

                if (uncle !== null && uncle.color === 'RED') {
                    parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    node = grandparent;
                } else {
                    if (node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }

                    node.parent!.color = 'BLACK';
                    grandparent.color = 'RED';
                    this.rotateLeft(grandparent);
                }
            }
        }

        if (this.root !== null) {
            this.root.color = 'BLACK';
        }
    }

    public insert(key: number, data: ReportResponse) {
        const newNode = new TreeNode(key, data);

        if (this.root === null) {
            newNode.color = 'BLACK';
            this.root = newNode;
            return;
        }

        let current: TreeNode | null = this.root;
        let parent: TreeNode | null = null;

        while (current !== null) {
            parent = current;

            if (key < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        newNode.parent = parent;

        if (parent !== null && key < parent.key) {
            parent.left = newNode;
        } else if (parent !== null) {
            parent.right = newNode;
        }
        this.fixInsert(newNode);
    }
    public getLatest(limit: number): ReportResponse[] {
        const result: ReportResponse[] = [];
        const reverseInOrder = (node: TreeNode | null) => {
            //condição de parada de recursão
            if (node === null || result.length >= limit) return;

            //vai o mais para a direita possível (mais recentes)
            reverseInOrder(node.right);

            // visita a Raiz e insere no array manipulando o índice
            if (result.length < limit) {
                result[result.length] = node.data;
            }

            //anda para a esquerda (mais antigos)
            if (result.length < limit) {
                reverseInOrder(node.left);
            }
        };
        reverseInOrder(this.root);
        return result;
    }
}