/**
 * @typedef {Object} Edge
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {Object} Tree
 * @property {Edge[]} edges
 * @property {Set.<string>} nodes
 */

const getEdgesFrom = (node, edges) => edges.filter(e => e.from === node);

const getNodesFromEdges = (edges) => {
  const nodes = new Set();
  edges.forEach(e => {
    nodes.add(e.from);
    nodes.add(e.to);
  });

  return nodes;
}

/**
 * @param {string} from -
 * @param {string} to -
 * @returns {Edge} -
 */
const makeEdge = (from, to) => ({ from, to });

/**
 * 
 * @param {Edge[]} edges -
 * @returns {Tree} -
 */
const makeTree = (edges) => ({
  edges,
  nodes: getNodesFromEdges(edges),
});

/**
 * @param {string} node - new root
 * @param {Tree} tree - the whole tree
 * @returns {Tree} - subtree of the supplied tree, rooted at node.
 */
const getSubTree = (node, tree) => {
  const nodesToLookFor = [node];
  const processedNodes = {};
  const subTreeEdges = [];
  let newRoot;
  while(newRoot = nodesToLookFor.pop()) {  // eslint-disable-line no-cond-assign
    if (processedNodes[newRoot]) {
      continue;
    }

    const newEdges = getEdgesFrom(newRoot, tree.edges);
    processedNodes[newRoot] = true;
    subTreeEdges.push(...newEdges);
    nodesToLookFor.push(...newEdges.map(e => e.to));
  }

  const newTree = makeTree(subTreeEdges);
  /*if (newTree.nodes.size > 2) {
    debugger;
  }*/

  return newTree;
}

const toGV = ({edges, nodes}) => {
  const strNodes = Array.from(nodes).map(n => `"${n}" [label="${n}"]`);
  const strEdges = edges.map(e => `"${e.from}" -> "${e.to}"`);
  return `digraph G {
    ${strNodes.join('\n')}
    ${strEdges.join('\n')}
  }`
}

module.exports = {
  makeEdge,
  makeTree,
  getSubTree,
  toGV,
};
