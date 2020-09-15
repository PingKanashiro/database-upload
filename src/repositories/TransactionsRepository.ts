import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.createQueryBuilder(
      'transactions',
    ).getMany();

    const income = transactions.filter(
      transaction => transaction.type === 'income',
    );

    const totalIncome = income.reduce(
      (total, { value }: { value: number }) => total + value,
      0,
    );

    const outcome = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const totalOutcome = outcome.reduce(
      (total, { value }: { value: number }) => total + value,
      0,
    );

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
