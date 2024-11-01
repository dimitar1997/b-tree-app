import { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import { BTree, BTreeNode } from './B-Tree-Logic/B-Tree-Node';

function App() {

  const [gap, setGap] = useState(0.2);
  const [value, setValue] = useState<string>('');
  const [btree, setBtree] = useState(new BTree<number>())


  useLayoutEffect(() => {
    // Create a new BTree instance
    // const newBTree = new BTree<number>();
    // newBTree.insert(20);
    // newBTree.insert(40);
    // newBTree.insert(10);
    // newBTree.insert(30);
    // newBTree.insert(50);
    // newBTree.insert(11);
    // newBTree.insert(12);
    // newBTree.insert(13);
    // newBTree.delete(50);
    // newBTree.delete(40);

    const newBTree = new BTree<number>();

    // Insert keys to create the required structure
    newBTree.insert(10);
    newBTree.insert(20);
    newBTree.insert(5);
    newBTree.insert(6);
    newBTree.insert(15);
    newBTree.insert(30);
    newBTree.insert(25);
    newBTree.insert(16);
    newBTree.delete(30);
    
    // Set the new BTree instance to state
    setBtree(newBTree);
  }, []);


  const returnNodes = (node: BTreeNode<number>): JSX.Element => {

    return (
      <>
        <span className='text-2xl p-[1em] border m-[0.2em] flex justify-center'>[{node.keys.toString()}]</span>
        {!node.isLeaf &&
          <div className='flex justify-between'>

            {node.children.map((child: BTreeNode<number>, index: number) => {

              return (
                <div className='flex justify-between flex-col' key={index}> {returnNodes(child)}</div>

              )

            })}
          </div>
        }
      </>
    )
  };

  const insertNewValue = () => {
    findMethod('insert');
  };

  const deleteValue = () => {
    findMethod('delete');
  };

  const findMethod = (method: 'insert' | 'delete') => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      switch (method) {
        case 'insert':
          btree.insert(Number(value));
          setBtree(btree)
          break;
        case 'delete':
          btree.delete(Number(value));
          setBtree(btree)
          break;
      }
      setValue('');
    } else {
      alert('Please insert number!')
    }
  }
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) setValue(e.target.value);
  };
  return (
    <div className='w-full h-full flex justify-center flex-col items-center m-[5em] overflow-hidden'>
      <div className='w-full flex  gap-[1em] justify-center mb-[0.5em]'>
        <input className='bg-grey  w-[10%] border' value={value} type='text' placeholder='Add number...' onChange={e => onChangeValue(e)}></input>
        <button className='bg-[#808080] px-[0.5em]' onClick={() => insertNewValue()}>Insert</button>
        <button className='bg-[#808080] px-[0.5em]' onClick={() => deleteValue()}>Delete</button>
      </div>

      {returnNodes(btree.returnRoot())}
    </div>
  );
}

export default App;
