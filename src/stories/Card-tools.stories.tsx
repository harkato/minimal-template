import { Meta, StoryObj } from '@storybook/react';
import { AnalyticsDashboardCard, Props } from 'src/sections/overview/card-tools';

const meta: Meta<typeof AnalyticsDashboardCard> = {
  title: 'Dashboard/AnalyticsDashboardCard',
  component: AnalyticsDashboardCard,
  argTypes: {
    onDelete: { action: 'deleted' }, // Mocks para eventos
  },
};

export default meta;
type Story = StoryObj<typeof AnalyticsDashboardCard>;

// Configuração padrão do componente
const defaultArgs: Props = {
  id: '1',
  title: 'Dashboard de Análise',
  vehicles: 120,
  nok: 10,
  nokVin: 0.8,
  targetAlert: 0.5,
  targetCritical: 0.7,
  topIssues: [
    { programNumber: 101, programName: 'Programa A', nokOkRate: 0.9 },
    { programNumber: 102, programName: 'Programa B', nokOkRate: 0.8 },
  ],
};

// Story padrão
export const Padrao: Story = {
  args: defaultArgs,
};

// Story com valores diferentes
export const ComCriticidadeAlta: Story = {
  args: {
    ...defaultArgs,
    nokVin: 0.9,
    targetAlert: 0.4,
    targetCritical: 0.6,
  },
};
