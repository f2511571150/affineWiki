export { createFactory } from './factory';
export * from './team-workspace.mock';
export * from './user.mock';
export * from './workspace.mock';
export * from './workspace-user.mock';

import { MockMailer } from './mailer.mock';
import { MockJobQueue } from './queue.mock';
import { MockTeamWorkspace } from './team-workspace.mock';
import { MockUser } from './user.mock';
import { MockWorkspace } from './workspace.mock';
import { MockWorkspaceUser } from './workspace-user.mock';

export const Mockers = {
  User: MockUser,
  Workspace: MockWorkspace,
  TeamWorkspace: MockTeamWorkspace,
  WorkspaceUser: MockWorkspaceUser,
};

export { MockJobQueue, MockMailer };
