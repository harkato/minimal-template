import { ComponentProps } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { OverviewAnalyticsView } from 'src/sections/overview/view';
import { Button } from '@mui/material';

type StoryProps = ComponentProps<typeof Button>;

const meta: Meta<StoryProps> = {
  component: Button,
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {};
