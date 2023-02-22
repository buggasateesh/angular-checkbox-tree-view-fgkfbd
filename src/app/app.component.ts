import { Component } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';

interface TreeNode {
  text: string;
  value: string;
  disabled: boolean;
  collapsed: boolean;
  checked: boolean;
  children: TreeNode[];
}

interface FlatNode {
  text: string;
  value: string;
  disabled: boolean;
  collapsed: boolean;
  checked: boolean;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  selectedParent: FlatNode | null = null;
  treeData: TreeNode[] = [
    {
      text: 'Reliance Retail Industry',
      value: '202331674621188670',
      disabled: false,
      collapsed: false,
      checked: false,
      children: [
        {
          text: 'Grocery',
          value: '202331674621277020',
          checked: false,
          disabled: false,
          collapsed: false,
          children: [
            {
              text: 'Reliance Fresh',
              value: '202331674621314460',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
            {
              text: 'Reliance Smart',
              value: '202331674621323740',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
            {
              text: 'Reliance Market',
              value: '202331674621344900',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
          ],
        },
        {
          text: 'Consumer electronics',
          value: '202331674621360350',
          checked: false,
          disabled: false,
          collapsed: false,
          children: [
            {
              text: 'Reliance Digital',
              value: '202331674621457400',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
            {
              text: 'Reliance Digital Life',
              value: '202331674621652600',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
            {
              text: 'RelianceresQ',
              value: '202331674621663550',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
          ],
        },
        {
          text: 'Fashion & Life Style',
          value: '202331674621685300',
          checked: false,
          disabled: false,
          collapsed: false,
          children: [
            {
              text: 'Trends',
              value: '202331674621711500',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
            {
              text: 'Foot print',
              value: '202331674621720350',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
            {
              text: 'Jewels',
              value: '202331674621733120',
              checked: true,
              disabled: false,
              collapsed: false,
              children: [],
            },
            {
              text: 'AJIO.COM',
              value: '202331674621754240',
              checked: false,
              disabled: false,
              collapsed: false,
              children: [],
            },
          ],
        },
        {
          text: 'Petro',
          value: '202331674621769570',
          checked: false,
          disabled: false,
          collapsed: false,
          children: [],
        },
      ],
    },
  ];

  private _transformer = (node: TreeNode, level: number) => {
    return {
      text: node.text,
      value: node.value,
      disabled: node.disabled,
      collapsed: node.collapsed,
      checked: node.checked,
      level: level,
      expandable: node.children.length > 0,
    };
  };
  // // sources
  // treeControl: FlatTreeControl<TreeNode>;
  // treeFlattener: MatTreeFlattener<TreeNode, FlatNode>;
  // dataSource: MatTreeFlatDataSource<TreeNode, FlatNode>;
  // // checked
  // checklistSelection = new SelectionModel<FlatNode>(true /* multiple */);
  // previousChecklistSelection: SelectionModel<FlatNode>;

// sources
  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  // checked
  checklistSelection = new SelectionModel<TreeNode>(true);
  previousChecklistSelection: SelectionModel<FlatNode>;


  constructor() {
    this.dataSource.data = this.treeData;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getLevel = (node: FlatNode) => node.level;

  isExpandable = (node: FlatNode) => node.expandable;

  getChildren = (node: TreeNode): TreeNode[] => node.children;

  hasNoContent = (_: number, nodeData: FlatNode) => nodeData.text === '';
  //     onCheckboxSelection(node: TreeNode): void {
  //   this.checklistSelection.clear();
  //   this.checklistSelection.select(node);
  // }
  
 
  onCheckboxSelection(node: TreeNode): void {
    console.log(node);
    this.checklistSelection.toggle(node);
    if (this.checklistSelection.isSelected(node)) {
      this.checklistSelection.selected.forEach((selectedNode) => {
        if (selectedNode !== node) {
          this.checklistSelection.deselect(selectedNode);
        }
      });
    }
  }

  
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TreeNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TreeNode): void {
    let parent: TreeNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TreeNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TreeNode): TreeNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) { return null; }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
