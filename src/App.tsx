import { useState } from 'react';
import './App.css';
import { BTree, BTreeNode } from './B-Tree-Logic/B-Tree-Node';

function App() {

  const [gap, setGap] = useState(0.2);
  const [value, setValue] = useState<string>('');
  const [btree, setBtree] = useState(new BTree<number>())


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
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      btree.insert(Number(value));
      setBtree(btree)
      setValue('');
    } else {
      alert('Please insert number!')
    }
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) setValue(e.target.value);
  };
  return (
    <div className='w-full h-full flex justify-center flex-col items-center m-[5em] overflow-hidden'>
      <div className='w-full flex  gap-[1em] justify-center mb-[0.5em]'>
        <input className='bg-grey  w-[10%] border' value={value} type='text' placeholder='Add number...' onChange={e => onChangeValue(e)}></input>
        <button className='bg-[#808080] px-[0.5em]' onClick={() => insertNewValue()}>Insert</button>
      </div>

      {returnNodes(btree.returnRoot())}
    </div>
  );
}

export default App;
